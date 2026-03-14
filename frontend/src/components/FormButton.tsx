import type { FormButtonProps } from '../interfaces';

export const FormButton = ({
	label,
	onClick,
	disabled,
	...props
}: FormButtonProps) => {
	return (
		<button
			type='button'
			className='btn'
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{label}
		</button>
	);
};
