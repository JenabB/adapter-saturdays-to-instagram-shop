const getVariantImage = (baseUrl: string, images: any[]) => {
  const imageToShow = images.find((image) =>
    ['E_1_U', 'S_1_U'].includes(image.image_code)
  );
  return `${baseUrl}${imageToShow.image_key}`;
};

export default getVariantImage;
