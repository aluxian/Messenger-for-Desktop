function createBadgeDataUrl (text) {
  const canvas = document.createElement('canvas');
  canvas.height = 140;
  canvas.width = 140;

  const context = canvas.getContext('2d');
  context.fillStyle = 'red';
  context.beginPath();
  context.ellipse(70, 70, 70, 70, 0, 0, 2 * Math.PI);
  context.fill();
  context.textAlign = 'center';
  context.fillStyle = 'white';

  if (text.length > 2) {
    context.font = 'bold 65px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 95);
  } else if (text.length > 1) {
    context.font = 'bold 85px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 100);
  } else {
    context.font = 'bold 100px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 105);
  }

  return canvas.toDataURL();
}

export default {
  createBadgeDataUrl
};
