import { useSelector, TypedUseSelectorHook } from 'react-redux';

import { RootState } from '@redux/store';

const selector: TypedUseSelectorHook<RootState> = useSelector;

export default selector;
