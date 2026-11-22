import api from './api.js';

async function imageToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function buildPostFormData({ title, content, image, fundraisingGoal, fundraisingDeadline, amountRaised }) {
  const body = new FormData();
  if (title !== undefined) body.append('title', title);
  if (content !== undefined) body.append('content', content);
  if (fundraisingGoal !== undefined) body.append('fundraisingGoal', fundraisingGoal);
  if (fundraisingDeadline !== undefined) body.append('fundraisingDeadline', fundraisingDeadline || '');
  if (amountRaised !== undefined) body.append('amountRaised', amountRaised);
  return body;
}

export async function fetchPostsByOng(ongId) {
  const { data } = await api.get(`/api/posts/ong/${ongId}`);
  return data;
}

export async function createPost(values) {
  const body = buildPostFormData(values);
  if (values.image) {
    body.append('image', await imageToBlob(values.image), 'post-image.jpg');
  }
  const { data } = await api.post('/api/posts', body);
  return data.post;
}

export async function updatePost(id, values) {
  const body = buildPostFormData(values);
  if (values.image) {
    body.append('image', await imageToBlob(values.image), 'post-image.jpg');
  }
  const { data } = await api.put(`/api/posts/${id}`, body);
  return data.post;
}

export async function deletePost(id) {
  await api.delete(`/api/posts/${id}`);
}
