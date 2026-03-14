export interface InputGroupProps {
	label: string;
	type: string;
	id: string;
	ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
	name: string;
	value: string;
	className?: string;
	readOnly?: boolean;
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	props?:
		| React.TextareaHTMLAttributes<HTMLTextAreaElement>
		| React.InputHTMLAttributes<HTMLInputElement>;
}
