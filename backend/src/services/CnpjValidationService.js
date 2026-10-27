function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function isValidCnpj(cnpj) {
  const value = onlyDigits(cnpj);

  if (!/^\d{14}$/.test(value) || /^(\d)\1{13}$/.test(value)) {
    return false;
  }

  const calculateDigit = (base, weights) => {
    const total = base.split('').reduce(
      (sum, digit, index) => sum + Number(digit) * weights[index],
      0
    );

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;  
  };

  const firstDigit = calculateDigit(
    value.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  const secondDigit = calculateDigit(
    value.slice(0, 12) + firstDigit,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return value.endsWith(`${firstDigit}${secondDigit}`);
}

class CnpjValidationService {
  async validate(cnpj) {
    const normalizedCnpj = onlyDigits(cnpj);

    const testOrganizations = {
      '12345678000195': 'ONG de Teste 1 — Ambiente de Desenvolvimento',
      '12345678000276': 'ONG de Teste 2 — Ambiente de Desenvolvimento',
      '12345678000357': 'ONG de Teste 3 — Ambiente de Desenvolvimento', // Adicione mais CNPJs de teste conforme necessário, daq em diante ta disp
      '12345678000438': 'ONG de Teste 4 — Ambiente de Desenvolvimento', 
      '12345678000519': 'ONG de Teste 5 — Ambiente de Desenvolvimento',
      '12345678000608': 'ONG de Teste 6 — Ambiente de Desenvolvimento',
      '12345678000780': 'ONG de Teste 7 — Ambiente de Desenvolvimento'
    };

    const testModeEnabled =
      process.env.NODE_ENV !== 'production' &&
      process.env.ALLOW_TEST_CNPJ === 'true';

    const testOrganization = testOrganizations[normalizedCnpj];

    if (testModeEnabled && testOrganization) {
      return {
        valid: true,
        cnpj: normalizedCnpj,
        legalName: testOrganization,
        situation: 'ATIVA',
        provider: 'Mock de desenvolvimento',
        checkedAt: new Date(),
        reason: null
      };
    }

    if (!isValidCnpj(normalizedCnpj)) {
      return {
        valid: false,
        cnpj: normalizedCnpj,
        reason: 'CNPJ inválido.'
      };
    }

    const baseUrl =
      process.env.CNPJ_API_BASE_URL ||
      'https://brasilapi.com.br/api/cnpj/v1';

    try {
      const response = await fetch(`${baseUrl}/${normalizedCnpj}`, {
        signal: AbortSignal.timeout(7000),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        return {
          valid: false,
          cnpj: normalizedCnpj,
          reason: 'Não foi possível confirmar a situação cadastral do CNPJ.'
        };
      }

      const data = await response.json();

      const situation = String(
        data.descricao_situacao_cadastral ?? ''
      ).trim().toUpperCase();

      const isActive =
        situation === 'ATIVA' ||
        Number(data.codigo_situacao_cadastral) === 2;

      return {
        valid: isActive,
        cnpj: normalizedCnpj,
        legalName: data.razao_social?.trim() || null,
        situation: situation || null,
        provider: 'BrasilAPI',
        checkedAt: new Date(),
        reason: isActive
          ? null
          : 'O CNPJ não está com situação cadastral ATIVA.'
      };
    } catch (error) {
      console.error('Falha ao consultar CNPJ:', error.message);

      return {
        valid: false,
        cnpj: normalizedCnpj,
        reason: 'Serviço de validação cadastral indisponível. Tente novamente.'
      };
    }
  }
}

export { isValidCnpj, onlyDigits };
export default new CnpjValidationService();