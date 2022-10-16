import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const projects: PlaywrightTestConfig["projects"] = [
    {
        name: "chromium",
        use: {
            ...devices["Desktop Chrome"],
        },
    },
];

if (process.env.CI || process.env.ALL_PLAYWRIGHT_BROWSERS) {
    projects.push({
        name: "firefox",
        use: {
            ...devices["Desktop Firefox"],
        },
    });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: __dirname + "/e2e",
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
    },
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 30000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "http://localhost:1934/",

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
    },

    /* Configure projects for major browsers */
    projects,

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    webServer: {
        command: "pnpm run dev:vite",
        url: "http://localhost:1934/",
        reuseExistingServer: !process.env.CI,
    },
};

export default config;