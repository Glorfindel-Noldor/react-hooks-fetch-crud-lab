import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for the form page to load
  await screen.findByText("New Question");

  // Fill out the form
  fireEvent.change(screen.getByLabelText("Prompt:"), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText("Answer 1:"), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText("Answer 2:"), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText("Correct Answer:"), {
    target: { value: "1" },
  });

  // Submit the form
  fireEvent.submit(screen.getByRole("Add Question"));

  // Wait for the new question to appear
  await waitFor(() => screen.findByText("Test Prompt"));

  // Expect the new question to be in the list
  expect(screen.getByText("Test Prompt")).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />);

  await screen.findByText(/lorem testum 2/g);

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");

  rerender(<App />);

  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});
