const FormInput = ({ id, label, type, placeholder, value, onChange }) => {
  return (
    <div className='mb-4'>
      <label htmlFor={id} className='form-label'>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className='form-control'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
