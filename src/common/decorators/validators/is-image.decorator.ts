import { registerDecorator, ValidationOptions } from 'class-validator';

export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg',
  'image/webp',
  'image/svg+xml',
];

export function IsImage(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isImage',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
          if (!value) {
            return true;
          }

          const mimetype = value?.mimetype || (await value)?.mimetype;
          return ALLOWED_IMAGE_TYPES.includes(mimetype);
        },
        defaultMessage() {
          return `The uploaded file is not an image`;
        },
      },
    });
  };
}
