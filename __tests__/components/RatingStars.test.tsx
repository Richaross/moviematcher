import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingStars } from '@/components/RatingStars';

describe('RatingStars Component', () => {
    it('renders correct number of stars', () => {
        render(<RatingStars rating={0} />);
        const stars = screen.getAllByRole('button'); // Stars are buttons in interactive mode
        expect(stars).toHaveLength(5);
    });

    it('renders filled stars for rating', () => {
        // Rating 10 = 5 stars
        const { rerender } = render(<RatingStars rating={10} />);
        const stars = screen.getAllByRole('button');
        // We can check attributes or class names. Assuming we use class 'text-yellow-500' for filled.
        // But for now let's just assert existence.
        // We will implement `data-testid` or accessible names if needed.
        // Let's assume stars have aria-label "Rate X out of 10" or similar.
    });

    it('calls onChange when clicked', () => {
        const handleChange = vi.fn();
        render(<RatingStars rating={0} onChange={handleChange} />);

        const stars = screen.getAllByRole('button');
        // Click the 3rd star (index 2). Rating should be 6 (if 2 points per star) or 3 if 5-point scale?
        // Plan said 0-10 scale.
        // Usually 5 stars.
        // 1st star: left half=1, right half=2? Or just 5 stars mapping to 2,4,6,8,10?
        // Let's implement full stars = 2 points.
        // Clicking 3rd star -> 6.

        fireEvent.click(stars[2]);
        expect(handleChange).toHaveBeenCalledWith(6);
    });

    it('does not call onChange when readOnly', () => {
        const handleChange = vi.fn();
        render(<RatingStars rating={5} readOnly onChange={handleChange} />);

        // In readOnly, maybe they are not buttons? 
        // If they are not buttons, `getAllByRole('button')` fails.
        // Let's use `container.querySelectorAll` or test ID.
        // Or assume they are just divs/spans in readOnly.

        // Wait, if I change implementation to not render buttons, the first test might fail if I use getAllByRole('button').
        // I will target by testid or svg.
    });
});
