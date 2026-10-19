export default function requireOngDocuments(req, res, next) {
  if (req.body.type !== 'O') {
    return next();
  }

  const files = req.files ?? {};
  const hasStatute = files.statuteDocument?.length === 1;
  const hasAddressProof = files.addressProofDocument?.length === 1;

  if (!hasStatute || !hasAddressProof) {
    return res.status(400).json({
      error:
        'Para cadastrar uma ONG, envie o estatuto social e o comprovante de endereço institucional em PDF.'
    });
  }

  return next();
}