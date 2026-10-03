// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach } from 'vitest';

const subscribeNewsletterMock = vi.fn().mockResolvedValue(undefined);
vi.mock('@/lib/newsletter-client', () => ({ subscribeNewsletter: subscribeNewsletterMock }));

describe('NewsletterForm', () => {
  beforeEach(() => {
    subscribeNewsletterMock.mockReset().mockResolvedValue(undefined);
  });

  it('submits the email and shows a confirmation message', async () => {
    const { NewsletterForm } = await import('./NewsletterForm');
    render(<NewsletterForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'chef@example.com');
    await userEvent.click(screen.getByRole('button', { name: /s'abonner/i }));

    expect(subscribeNewsletterMock).toHaveBeenCalledWith('chef@example.com');
    expect(await screen.findByText(/merci, vous êtes inscrit/i)).toBeInTheDocument();
  });

  it('shows an error and keeps the form when subscribeNewsletter rejects', async () => {
    subscribeNewsletterMock.mockRejectedValueOnce(new Error('PERMISSION_DENIED'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { NewsletterForm } = await import('./NewsletterForm');
    render(<NewsletterForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'chef@example.com');
    await userEvent.click(screen.getByRole('button', { name: /s'abonner/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/l'inscription a échoué/i);
    expect(screen.queryByText(/merci, vous êtes inscrit/i)).not.toBeInTheDocument();
    // form is still there so the user can retry
    expect(screen.getByLabelText(/email/i)).toHaveValue('chef@example.com');
    errorSpy.mockRestore();
  });
});
