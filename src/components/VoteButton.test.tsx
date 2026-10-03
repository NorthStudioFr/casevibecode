// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const castVoteMock = vi.fn().mockResolvedValue({ counts: { remplace: 3, pasRemplacable: 1 } });
vi.mock('@/lib/votes-client', () => ({ castVote: castVoteMock }));

describe('VoteButton', () => {
  beforeEach(() => {
    castVoteMock.mockClear();
    castVoteMock.mockResolvedValue({ counts: { remplace: 3, pasRemplacable: 1 } });
  });

  it('casts the vote and optimistically increments the count, then updates with server count', async () => {
    const { VoteButton } = await import('./VoteButton');
    render(<VoteButton logicielId="zenchef" initialCounts={{ remplace: 2, pasRemplacable: 1 }} />);

    await userEvent.click(screen.getByRole('button', { name: /je l'ai remplacé/i }));

    expect(castVoteMock).toHaveBeenCalledWith('zenchef', 'remplace');
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('rolls back the optimistic count and shows an error when castVote rejects', async () => {
    castVoteMock.mockRejectedValueOnce(new Error('PERMISSION_DENIED'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { VoteButton } = await import('./VoteButton');
    render(<VoteButton logicielId="zenchef" initialCounts={{ remplace: 2, pasRemplacable: 1 }} />);

    await userEvent.click(screen.getByRole('button', { name: /je l'ai remplacé/i }));

    expect(castVoteMock).toHaveBeenCalledWith('zenchef', 'remplace');
    expect(await screen.findByRole('alert')).toHaveTextContent('PERMISSION_DENIED');
    // Count is back to its initial value, not the optimistic 3.
    expect(screen.getByRole('button', { name: /je l'ai remplacé/i })).toHaveTextContent('(2)');
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
