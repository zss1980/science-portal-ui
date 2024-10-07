import { Image } from '../auth/types';
import { DESKTOP, DESKTOP_APP, HEADLESS } from '../auth/constants';

export const getImagesByType = (images: Image[]) => {
  return images.reduce(
    (acc, img) => {
      img.types.forEach((bType) => {
        let type = bType;
        if (type === HEADLESS) {
          return acc;
        }
        if (type === DESKTOP_APP) {
          type = DESKTOP;
        }

        const imageProject = getImageProject(img);

        if (!acc?.[type]) {
          acc[type] = {};
        }
        if (!acc?.[type]?.[imageProject]) {
          acc[type][imageProject] = [];
        }

        acc[type][imageProject].push(img);
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
export const getImagesNamesSorted = (images: Image[]): string[] => {
  return images
    .map((image) => image.id.split('/')?.[2] || '')
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
};
