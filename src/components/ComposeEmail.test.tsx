import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComposeEmail from "@/components/ComposeEmail";
import { sendEmail } from "@/services/emailService";

jest.mock("@/services/emailService", () => ({
  sendEmail: jest.fn(),
}));

const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

describe("ComposeEmail Component", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dialog when open", () => {
    render(<ComposeEmail open={true} onClose={onClose} />);
    expect(screen.getByText("New Email")).toBeInTheDocument();
    expect(screen.getByLabelText("To")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  test("does not render CC/BCC fields initially", () => {
    render(<ComposeEmail open={true} onClose={onClose} />);
    expect(screen.queryByLabelText("Cc")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bcc")).not.toBeInTheDocument();
  });

  test("shows CC/BCC fields when clicked", () => {
    render(<ComposeEmail open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Cc"));
    fireEvent.click(screen.getByText("Bcc"));
    expect(screen.getByLabelText("Cc")).toBeInTheDocument();
    expect(screen.getByLabelText("Bcc")).toBeInTheDocument();

    // "Cc" and "Bcc" buttons disappear after showing fields
    expect(screen.queryByTestId("compose-email-cc")).not.toBeInTheDocument();
    expect(screen.queryByTestId("compose-email-bcc")).not.toBeInTheDocument();
  });

  test("updates form state on input change", () => {
    render(<ComposeEmail open={true} onClose={onClose} />);
    const toInput = screen.getByLabelText("To");
    fireEvent.change(toInput, { target: { value: "test@example.com" } });
    expect(toInput).toHaveValue("test@example.com");

    const subjectInput = screen.getByLabelText("Subject");
    fireEvent.change(subjectInput, { target: { value: "Hello" } });
    expect(subjectInput).toHaveValue("Hello");

    const contentInput = screen.getByLabelText("Content");
    fireEvent.change(contentInput, { target: { value: "Email body" } });
    expect(contentInput).toHaveValue("Email body");
  });

  test("Cancel button calls onClose", () => {
    render(<ComposeEmail open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  test("Send button triggers handleSubmit success flow", async () => {
    (sendEmail as jest.Mock).mockResolvedValueOnce(undefined);
    render(<ComposeEmail open={true} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText("To"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Hi" } });
    fireEvent.change(screen.getByLabelText("Content"), { target: { value: "Body" } });

    fireEvent.click(screen.getByText("Send"));

    // Button should show "Sending..."
    expect(screen.getByText("Sending...")).toBeInTheDocument();

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledWith({
        to: "a@b.com",
        cc: "",
        bcc: "",
        subject: "Hi",
        content: "Body",
      });
      expect(mockRefresh).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    // Fields reset after success
    expect(screen.getByLabelText("To")).toHaveValue("");
    expect(screen.getByLabelText("Subject")).toHaveValue("");
    expect(screen.getByLabelText("Content")).toHaveValue("");
  });

  test("Send button triggers handleSubmit failure flow", async () => {
    (sendEmail as jest.Mock).mockRejectedValueOnce(new Error("Fail"));
    render(<ComposeEmail open={true} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText("To"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Content"), { target: { value: "Body" } });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalled();
      expect(screen.getByText("Failed to send email")).toBeInTheDocument();
    });
  });

  test("Send/Cancel buttons disabled when loading", async () => {
    (sendEmail as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<ComposeEmail open={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("To"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Content"), { target: { value: "Body" } });

    fireEvent.click(screen.getByText("Send"));

    expect(screen.getByText("Sending...")).toBeDisabled();
    expect(screen.getByText("Cancel")).toBeDisabled();

    await waitFor(() => expect(sendEmail).toHaveBeenCalled());
  });
});
