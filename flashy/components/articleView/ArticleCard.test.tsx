import { FlashcardSet } from '@/app/types/flashcard';
import { render, screen } from '@/test-utils';
import { dummyFlashcard, dummyUser } from '@/test-utils/testData';
import { ArticleCard } from './ArticleCard';

function countOccurences(flashcardSet: FlashcardSet): { [key: number]: number } {
    const [numOfLikes, numViews, numOfComments] = [flashcardSet.numOfLikes, flashcardSet.numViews, flashcardSet.numOfComments ?? 0];

    const occurrences: { [key: number]: number } = {};

    [numOfLikes, numViews, numOfComments].forEach((value) => {
        if (occurrences[value]) {
            occurrences[value]++;
        } else {
            occurrences[value] = 1;
        }
    });

    return occurrences;
}

describe("ArticleCard Component Test", () => {
    it("renders correctly", () => {
        render(<ArticleCard flashcard={dummyFlashcard} user={dummyUser} />);

        // Checks whether title is displayed
        expect(screen.getByText(dummyFlashcard.title)).toBeInTheDocument();

        // Checks whether information displayed is correct
        const occurrences = countOccurences(dummyFlashcard);
        expect(screen.getAllByText(dummyFlashcard.numViews)).toHaveLength(occurrences[dummyFlashcard.numViews]);
        expect(screen.getAllByText(dummyFlashcard.numOfLikes)).toHaveLength(occurrences[dummyFlashcard.numOfLikes]);
        expect(screen.getAllByText(dummyFlashcard.numOfComments ?? 0)).toHaveLength(occurrences[dummyFlashcard.numOfComments ?? 0]);
    });
});

describe("ArticleCard Snapshot Test", () => {
    it("Snapshot matches", () => {
        const { asFragment } = render(<ArticleCard flashcard={dummyFlashcard} user={dummyUser} />);;
        expect(asFragment()).toMatchSnapshot();
    });
});