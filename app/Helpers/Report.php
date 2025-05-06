<?php

namespace App\Helpers;

use Illuminate\Validation\ValidationException;
/**
 * Class SuccessReport
 * Provides a standardized way to return success notifications.
 */
class Report
{
    /**
     * Generates a standardized success response array.
     *
     * @param string $message The success message to display in the toast.
     * @param array<string, mixed> $additionalData Optional additional data to be passed as props to the frontend.
     * @return array<string, mixed> The structured array including toast notification and additional data.
     */
    public static function success(string $message, array $additionalData = []): array
    {
        $toastData = [
            'toast' => [
                'message' => $message,
                'type' => 'success',
            ],
        ];
        // Merge additional data with toast data.
        // If there's a key conflict, $toastData will overwrite keys from $additionalData,
        // ensuring the toast structure is preserved.
        // If you want $additionalData to take precedence, reverse the order of merge.
        // However, for this use case, ensuring 'toast' is correctly structured is likely preferred.
        return array_merge($additionalData, $toastData);
    }


    /**
     * Reports an error by throwing a ValidationException.
     *
     * Formats the exception messages to include a 'toast' notification
     * and optionally associates the message with a specific field.
     *
     * @param string $message The error message to display in the toast.
     * @param string|null $field The specific input field related to the error (optional).
     * @param int $code The HTTP status code (Note: ValidationException defaults to 422, this parameter is currently unused by ValidationException::withMessages).
     * @throws \Illuminate\Validation\ValidationException Always throws a ValidationException.
     */
    public static function error(string $message, ?string $field = null): void
    {
        // Initialize errors array with the mandatory 'toast' structure
        $errors = [
            'toast' => ['message' => $message, 'type' => 'error']
        ];

        // If a specific field is provided, add it to the errors array
        if ($field !== null) {
            // Use the field name as the key and the message as the value
            $errors[$field] = $message;
        }

        // Throw the ValidationException with the structured error messages.
        // Laravel's handler will typically catch this and return a JSON response
        // with HTTP status code 422 (Unprocessable Entity).
        throw ValidationException::withMessages($errors);
    }

}
