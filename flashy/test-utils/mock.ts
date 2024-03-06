// Overrides/Mocks router to prevent errors in tests
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

export { };

