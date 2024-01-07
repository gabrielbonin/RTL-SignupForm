import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

beforeEach(() => {
  console.log('executa toda vez antes de cada teste')
  render(<App />);
});

beforeAll(() => {
  console.log('roda uma vez antes de todos os testes')
})

afterEach(() => {
  console.log('depois de cada testes')
})

afterAll(() => {
  console.log('roda uma vez depois de todos os testes')
})

test("inputs should be initially empty", () => {

  const emailInputElement = screen.getByRole("textbox")
  const passwordInputElement = screen.getByLabelText("Password")
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)
  expect(emailInputElement.value).toBe("")
  expect(passwordInputElement.value).toBe("")
  expect(confirmPasswordInputElement.value).toBe("")
});

test("should be able to type an email", () => {

  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  userEvent.type(emailInputElement, "selena@gmail.com")
  expect(emailInputElement.value).toBe("selena@gmail.com")
});

test("should be able to type a password", () => {

  const passwordInputElement = screen.getByLabelText("Password");
  userEvent.type(passwordInputElement, "password!");
  expect(passwordInputElement.value).toBe("password!");
})

test("should be able to type a confirm password", () => {

  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
  userEvent.type(confirmPasswordInputElement, "password!");
  expect(confirmPasswordInputElement.value).toBe("password!");
})

test("should email error message on invalid email", () => {


  const emailErrorElement = screen.queryByText(/the email you input is invalid/i);

  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });


  expect(emailErrorElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, "selenagmail.com");
  userEvent.click(submitBtnElement);

  const emailErrorElement2 = screen.queryByText(/the email you input is invalid/i);

  expect(emailErrorElement2).toBeInTheDocument();
});


test("should show password error if the password is less than 5 characters", () => {


  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });

  const passwordInputElement = screen.getByLabelText("Password");

  const passwordErrorElement = screen.queryByText(/the password you entered should contain 5 or more characters/i);

  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });

  userEvent.type(emailInputElement, "selena@gmail.com");

  expect(passwordErrorElement).not.toBeInTheDocument()

  userEvent.type(passwordInputElement, "123");
  userEvent.click(submitBtnElement);

  const passwordErrorElementAgain = screen.queryByText(/the password you entered should contain 5 or more characters/i);
  expect(passwordErrorElementAgain).toBeInTheDocument()
});

test("should show confirm password error if the passwords don't match", () => {


  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });

  const passwordInputElement = screen.getByLabelText("Password");

  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);

  const confirmPasswordErrorElement = screen.queryByText(/the passwords don't match. try again/i);

  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });

  userEvent.type(emailInputElement, "selena@gmail.com");
  userEvent.type(passwordInputElement, "12345");

  expect(confirmPasswordErrorElement).not.toBeInTheDocument()

  userEvent.type(confirmPasswordInputElement, "123456");
  userEvent.click(submitBtnElement);

  const confirmPasswordErrorElementAgain = screen.queryByText(/the passwords don't match. try again/i);
  expect(confirmPasswordErrorElementAgain).toBeInTheDocument()
});