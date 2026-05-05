import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const expectNoSeriousA11yViolations = async (page: Page, label: string): Promise<void> => {
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
    const blockers = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    if (blockers.length > 0) {
        const summary = blockers.map((v) => `${v.id} (${v.impact}): ${v.help}`).join('\n');
        // Surface details in test report
        console.log(`[axe ${label}]\n${summary}`);
    }
    expect(blockers, `Serious or critical a11y violations on ${label}`).toEqual([]);
};
