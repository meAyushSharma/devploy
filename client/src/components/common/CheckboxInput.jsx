import { memo } from "react";
import { ImCheckboxChecked } from "react-icons/im";

const CheckboxInput = memo(({ label, name, id, onChangeFun }) => {
  return (
      // <div className="inline-flex items-center">
      //         <span className="flex items-center md:text-lg sm:text-base text-sm font-medium text-gray-800 px-3 w-1/5">{label}</span>
      //     <label className="flex items-center cursor-pointer relative" htmlFor={id}>
      //         <input
      //             type="checkbox"
      //             className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border-2 border-slate-400 checked:bg-slate-800 checked:border-slate-800"
      //             id={id}
      //             onChange={onChangeFun}
      //             name={name}
      //         />
      //         <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      //             <ImCheckboxChecked />
      //         </span>
      //     </label>
      // </div>
    <div className="flex items-center w-full">
    <span className="flex items-center font-medium text-gray-800 px-3 
        md:text-lg sm:text-base text-sm 
        md:w-1/4 sm:w-1/3 w-1/2">
        {label}
    </span>
    <label className="flex items-center cursor-pointer relative" htmlFor={id}>
        <input
            type="checkbox"
            className="peer h-6 w-6 sm:h-5 sm:w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border-2 border-slate-400 checked:bg-slate-800 checked:border-slate-800"
            id={id}
            onChange={onChangeFun}
            name={name}
        />
        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <ImCheckboxChecked />
        </span>
    </label>
</div>

  );
});

export default CheckboxInput;