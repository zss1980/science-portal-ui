import { Image } from '../auth/types';

export const getImagesByProject = (images: Image[]) => {
  return images.reduce(
    (acc, img) => {
      const imageProject = getImageProject(img);
      if (!acc[imageProject]) {
        acc[imageProject] = {};
      }

      img.types.forEach((type) => {
        if (!acc?.[imageProject]?.[type]) {
          acc[imageProject][type] = [];
        }
        acc[imageProject][type].push(img);
      });
      return acc;
    },
    {} as { [key: string]: { [key: string]: Image[] } },
  );
};

// "images.canfar.net/skaha/carta:4.0"
export const getImageProject = (image: Image): string => {
  return image.id.split('/')?.[1];
};
