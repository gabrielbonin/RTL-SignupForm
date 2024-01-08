import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  console.log('executa toda vez antes de cada teste');
  render(<App />);
});

beforeAll(() => {
  console.log('roda uma vez antes de todos os testes');
});

afterEach(() => {
  console.log('depois de cada testes');
});

afterAll(() => {
  console.log('roda uma vez depois de todos os testes');
});

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i,
  });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const clickOnSubmitButton = () => {
  const submitBtnElement = screen.getByRole('button', {
    name: /submit/i,
  });

  userEvent.click(submitBtnElement);
};

describe('App', () => {
  test('inputs should be initially empty', () => {
    const emailInputElement = screen.getByRole('textbox');
    const passwordInputElement = screen.getByLabelText('Password');
    const confirmPasswordInputElement =
      screen.getByLabelText(/confirm password/i);
    expect(emailInputElement.value).toBe('');
    expect(passwordInputElement.value).toBe('');
    expect(confirmPasswordInputElement.value).toBe('');
  });

  test('should be able to type an email', () => {
    const { emailInputElement } = typeIntoForm({
      email: 'selena@gmail.com',
    });
    expect(emailInputElement.value).toBe('selena@gmail.com');
  });

  test('should be able to type a password', () => {
    const { passwordInputElement } = typeIntoForm({
      password: 'password!',
    });
    expect(passwordInputElement.value).toBe('password!');
  });

  test('should be able to type a confirm password', () => {
    const { confirmPasswordInputElement } = typeIntoForm({
      confirmPassword: 'password!',
    });

    expect(confirmPasswordInputElement.value).toBe('password!');
  });

  describe('Error handling', () => {
    test('should email error message on invalid email', () => {
      expect(
        screen.queryByText(/the email you input is invalid/i),
      ).not.toBeInTheDocument();

      typeIntoForm({
        email: 'selena@gmail.com',
      });

      clickOnSubmitButton();

      expect(
        screen.queryByText(/the email you input is invalid/i),
      ).not.toBeInTheDocument();
    });

    test('should show password error if the password is less than 5 characters', () => {
      typeIntoForm({
        email: 'selena@gmail.com',
      });

      expect(
        screen.queryByText(
          /the password you entered should contain 5 or more characters/i,
        ),
      ).not.toBeInTheDocument();

      typeIntoForm({
        password: '123',
      });

      clickOnSubmitButton();

      expect(
        screen.getByText(
          /the password you entered should contain 5 or more characters/i,
        ),
      ).toBeInTheDocument();
    });

    test("should show confirm password error if the passwords don't match", () => {
      const confirmPasswordInputElement =
        screen.getByLabelText(/confirm password/i);

      typeIntoForm({
        email: 'selena@gmail.com',
        password: '12345',
      });

      expect(
        screen.queryByText(/the passwords don't match. try again/i),
      ).not.toBeInTheDocument();

      userEvent.type(confirmPasswordInputElement, '123456');

      typeIntoForm({
        confirmPassword: '123456',
      });

      clickOnSubmitButton();

      expect(
        screen.getByText(/the passwords don't match. try again/i),
      ).toBeInTheDocument();
    });

    test('should show no error message if very input is valid', () => {
      typeIntoForm({
        email: 'selena@gmail.com',
        password: '123456',
        confirmPassword: '123456',
      });

      clickOnSubmitButton();

      expect(
        screen.queryByText(/the email you input is invalid/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          /the password you entered should contain 5 or more characters/i,
        ),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/the passwords don't match. try again/i),
      ).not.toBeInTheDocument();
    });
  });
});
