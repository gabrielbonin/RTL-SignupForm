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

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)
  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password)
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword)
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement
  }
};

const clickOnSubmitButton = () => {
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });

  userEvent.click(submitBtnElement);
}

test("inputs should be initially empty", () => {

  const emailInputElement = screen.getByRole("textbox")
  const passwordInputElement = screen.getByLabelText("Password")
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)
  expect(emailInputElement.value).toBe("")
  expect(passwordInputElement.value).toBe("")
  expect(confirmPasswordInputElement.value).toBe("")
});

test("should be able to type an email", () => {
  const { emailInputElement } = typeIntoForm({
    email: 'selena@gmail.com'
  });
  expect(emailInputElement.value).toBe("selena@gmail.com")
});

test("should be able to type a password", () => {
  const { passwordInputElement } = typeIntoForm({
    password: "password!",
  })
  expect(passwordInputElement.value).toBe("password!");
})

test("should be able to type a confirm password", () => {
  const { confirmPasswordInputElement } = typeIntoForm({
    confirmPassword: "password!",
  });

  expect(confirmPasswordInputElement.value).toBe("password!");
});

test("should email error message on invalid email", () => {

  const emailErrorElement = screen.queryByText(/the email you input is invalid/i);


  expect(emailErrorElement).not.toBeInTheDocument();

  typeIntoForm({
    email: "selena@gmail.com"
  });

  clickOnSubmitButton();

  const emailErrorElement2 = screen.queryByText(/the email you input is invalid/i);

  expect(emailErrorElement2).toBeInTheDocument();
});


test("should show password error if the password is less than 5 characters", () => {

  const passwordErrorElement = screen.queryByText(/the password you entered should contain 5 or more characters/i);

  typeIntoForm({
    email: "selena@gmail.com",
  });

  expect(passwordErrorElement).not.toBeInTheDocument()

  typeIntoForm({
    password: "123"
  });

  clickOnSubmitButton();

  const passwordErrorElementAgain = screen.queryByText(/the password you entered should contain 5 or more characters/i);
  expect(passwordErrorElementAgain).toBeInTheDocument();
});

test("should show confirm password error if the passwords don't match", () => {

  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
  const confirmPasswordErrorElement = screen.queryByText(/the passwords don't match. try again/i);
  typeIntoForm({
    email: "selena@gmail.com",
    password: "12345"
  });

  expect(confirmPasswordErrorElement).not.toBeInTheDocument();

  userEvent.type(confirmPasswordInputElement, "123456");

  typeIntoForm({
    confirmPassword: "123456"
  });

  clickOnSubmitButton();

  const confirmPasswordErrorElementAgain = screen.queryByText(/the passwords don't match. try again/i);
  expect(confirmPasswordErrorElementAgain).toBeInTheDocument();
});

test("should show no error message if very input is valid", () => {
  typeIntoForm({
    email: "selena@gmail.com",
    password: "123456",
    confirmPassword: "123456"
  });

  clickOnSubmitButton();

  const emailErrorElement = screen.queryByText(
    /the email you input is invalid/i
  );

  const passwordErrorElement = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );

  const confirmPasswordErrorElement = screen.queryByText(
    /the passwords don't match. try again/i
  );

  expect(emailErrorElement).not.toBeInTheDocument();
  expect(passwordErrorElement).not.toBeInTheDocument();
  expect(confirmPasswordErrorElement).not.toBeInTheDocument();
});