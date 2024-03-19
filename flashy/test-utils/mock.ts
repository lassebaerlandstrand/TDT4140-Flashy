// Overrides/Mocks router to prevent errors in tests
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  usePathname() {
    return "/";
  },
}));

// Mocks useSession hook
// jest.mock("next-auth/react", () => ({
//     useSession: jest.fn(() => ({ data: { user: dummyAdmin } }))
// }));

export {};
