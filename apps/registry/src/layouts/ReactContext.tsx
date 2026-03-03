import { Fragment } from 'react/jsx-runtime';
import { Toaster } from 'sonner';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Fragment>
            {children}
            <Toaster richColors position="top-right" theme="dark" closeButton />
        </Fragment>
    );
};
