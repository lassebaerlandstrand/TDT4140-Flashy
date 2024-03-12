import { render } from '@/test-utils';
import { dummyAdmin } from '@/test-utils/testData';
import { useSession } from "next-auth/react";
import HeaderMenu from './Header';

jest.mock("next-auth/react", () => ({
    useSession: jest.fn()
}));

describe("Header Snapshot Test", () => {
    it("Check if snapshot matches", () => {
        (useSession as jest.Mock).mockImplementation(() => ({ data: { user: dummyAdmin } }));

        const { asFragment } = render(<HeaderMenu />);
        expect(asFragment()).toMatchSnapshot();
    });
});