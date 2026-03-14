import type { InputGroupProps } from '../interfaces';

export const InputGroup = ({
	label,
	type,
	id,
	ref,
	name,
	value,
	onChange,
	className,
	readOnly,
	...props
}: InputGroupProps) => {
	return (
		<div className='input-group'>
			<label htmlFor={id}>{label}:</label>
			{type === 'textarea' ? (
				<textarea
					readOnly={readOnly}
					ref={ref as React.Ref<HTMLTextAreaElement>}
					id={id}
					name={name}
					value={value}
					onChange={onChange}
					rows={20}
					className={className}
					{...props}
				/>
			) : (
				<input
					readOnly={readOnly}
					ref={ref as React.Ref<HTMLInputElement>}
					type={type}
					id={id}
					name={name}
					value={value}
					onChange={onChange}
					className={className}
					{...props}
				/>
			)}
		</div>
	);
};
