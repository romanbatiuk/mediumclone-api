import {
	ArgumentMetadata,
	HttpException,
	HttpStatus,
	Injectable,
	PipeTransform,
	ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class BackendValidationPipe implements PipeTransform {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.validateMetaType(metatype)) {
			return value;
		}

		const object = plainToClass(metatype, value);
		const errors = await validate(object);

		if (errors.length > 0) {
			throw new HttpException(
				{ errors: this.formatErrors(errors) },
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}
		return value;
	}

	private formatErrors(errors: ValidationError[]) {
		return errors.reduce((acc, err) => {
			acc[err.property] = Object.values(err.constraints);
			return acc;
		}, {});
	}

	private validateMetaType(metatype: any): boolean {
		const types: any = [String, Boolean, Number, Array, Object];
		return !types.includes(metatype);
	}
}
