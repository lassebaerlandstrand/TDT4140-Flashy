import { render } from '@/test-utils';
import { dummyAdmin, dummyUser } from '@/test-utils/testData';
import { useSession } from "next-auth/react";
import { UsersTable } from './UserTable';

jest.mock("next-auth/react", () => ({
    useSession: jest.fn()
}));

describe("UserTable Snapshot Test", () => {
    it("Check if snapshot matches", () => {
        (useSession as jest.Mock).mockImplementation(() => ({ data: { user: dummyAdmin } }));

        const { asFragment } = render(<UsersTable users={[dummyAdmin, dummyUser]} />);
        expect(asFragment()).toMatchSnapshot();
    });
});