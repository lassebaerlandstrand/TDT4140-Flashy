import { FlashcardSet } from '@/app/types/flashcard';
import { render, screen } from '@/test-utils';
import { dummyFlashcard, dummyUser } from '@/test-utils/testData';
import { ArticleCard } from './ArticleCard';

// 
function countOccurences(flashcardSet: FlashcardSet): { [key: number]: number } {
    const { numOfLikes, numViews, numOfFavorites } = flashcardSet;
    const occurrences: { [key: number]: number } = {};

    [numOfLikes, numViews, numOfFavorites].forEach((value) => {
        if (occurrences[value]) {
            occurrences[value]++;
        } else {
            occurrences[value] = 1;
        }
    });

    return occurrences;
}

describe('ArticleCard Component Test', () => {
    it('renders correctly', () => {

        render(<ArticleCard flashcard={dummyFlashcard} user={dummyUser} />);

        // Checks whether title is displayed
        expect(screen.getByText(dummyFlashcard.title)).toBeInTheDocument();

        // Checks whether information displayed is correct
        const occurrences = countOccurences(dummyFlashcard);
        console.log(occurrences);
        // console.log(screen.getAllByText(dummyFlashcard.numViews).);
        // expect();
        // expect(screen.getAllByText(occurrences[dummyFlashcard.numViews])).toBeInTheDocument();
        // expect(screen.getAllByText(occurrences[dummyFlashcard.numOfFavorites])).toBeInTheDocument();
    });
});