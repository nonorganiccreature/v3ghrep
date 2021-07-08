export default function useDebounceMethod() {
    const debounce = (fn, interval) => {
        let timer;
        return function debounced() {
            clearTimeout(timer);
            let args = arguments;
            let that = this;
            timer = setTimeout(function callOriginalFn() {
                fn.apply(that, args);
            }, interval);
        };
    }
    return {
        debounce
    }
}
