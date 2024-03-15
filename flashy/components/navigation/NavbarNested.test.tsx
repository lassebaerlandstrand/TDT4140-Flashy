import { render, screen } from '@/test-utils';
import { dummyAdmin, dummyUser } from '@/test-utils/testData';
import { useSession } from 'next-auth/react';
import { NavbarNested } from './NavbarNested';

jest.mock("next-auth/react", () => ({
    useSession: jest.fn()
}));

describe("NavbarNested Component Test", () => {

    it("renders correctly for user", () => {

        (useSession as jest.Mock).mockImplementation(() => ({ data: { user: dummyUser } }));

        render(<NavbarNested />);

        // Checks whether the logo is displayed
        expect(screen.getByAltText("Flashy logo")).toBeInTheDocument();

        // Checks whether the links are displayed
        expect(screen.getByText("Profil")).toBeInTheDocument();
        expect(screen.getByText("Mine Flashies")).toBeInTheDocument();
        expect(screen.getByText("Alle flashies")).toBeInTheDocument();
        expect(screen.queryByText("Administrasjon")).toBeNull();
    });

    it("renders correctly for admin", () => {
        (useSession as jest.Mock).mockImplementation(() => ({ data: { user: dummyAdmin } }));

        render(<NavbarNested />);

        expect(screen.getByText("Administrasjon")).toBeInTheDocument();
    });


});

describe("Navbar Snapshot Test", () => {
    it("Snapshot matches", () => {
        (useSession as jest.Mock).mockImplementation(() => ({ data: { user: dummyAdmin } }));

        const { asFragment } = render(<NavbarNested />);
        expect(asFragment()).toMatchSnapshot();
    });
});




