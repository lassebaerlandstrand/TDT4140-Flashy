import { MantineProvider } from '@mantine/core';
import { render as testingLibraryRender } from '@testing-library/react';

// From official Mantine documentation
export function render(ui: React.ReactNode) {
    return testingLibraryRender(<>{ui}</>, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <MantineProvider>{children}</MantineProvider>
        ),
    });
}