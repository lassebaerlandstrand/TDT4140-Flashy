import { render, screen } from '@/test-utils';
import { dummyFlashcard, dummyUser } from '@/test-utils/testData';
import { ArticleCard } from './ArticleCard';

jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

describe('ArticleCard Component Test', () => {
    it('renders correctly', () => {

        render(<ArticleCard flashcard={dummyFlashcard} user={dummyUser} />);

        // Checks whether title is displayed
        expect(screen.getByText(dummyFlashcard.title)).toBeInTheDocument();
    });
});