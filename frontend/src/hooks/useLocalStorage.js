import { useState, useEffect } from "react";

const useLocalStorage = (key, defaultValue = null) => {
	const initialVal = localStorage.getItem(key) || defaultValue;
	const [state, setState] = useState(initialVal);

    useEffect(() => {
        console.debug ("hooks useLocalStorage useEffect", "state=", state) ;
        if (state === null) {
            localStorage.removeItem(key)
		} else {
			localStorage.setItem(key, state);
		}
	}, [key, state]);

	return [state, setState];
};

export default useLocalStorage;
