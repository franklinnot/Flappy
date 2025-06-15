<?php

namespace App\Utils;

use App\Exceptions\ReportableException;
use Illuminate\Validation\ValidationException;

/**
 * Class Report
 * Proporciona métodos estandarizados para generar respuestas, a menudo incluyendo notificaciones toast.
 * Los métodos de error/advertencia siempre lanzan ValidationException con una estructura específica.
 */
class Report
{
    /**
     * Genera una respuesta de éxito estandarizada. Flashea a la sesión.
     */
    public static function success(string $route, string $message, array $additionalData = [])
    {
        session()->flash('report', [
            'message' => $message,
            'type' => 'success',
        ]);
        return redirect()->route($route)->with($additionalData);
    }

    /**
     * Genera una respuesta de información estandarizada. Flashea a la sesión.
     */
    public static function information(string $route, string $message)
    {
        session()->flash('report', [
            'message' => $message,
            'type' => 'information',
        ]);
        return redirect()->route($route);
    }

    /**
     * Genera una respuesta de advertencia. Siempre lanza una ValidationException.
     * Incluye un 'report' con mensaje y tipo, y opcionalmente un error para un campo específico.
     */
    public static function warning(string $message, ?string $field = null)
    {
        // Si se especifica un campo, lanza ValidationException para errores de campo
        if ($field !== null) {
            $errorMessages = [
                'report_message' => $message, 
                'report_type' => 'warning',  
                $field => $message,          
            ];
            throw ValidationException::withMessages($errorMessages);
        }

        throw new ReportableException($message, 'warning');
    }

    /**
     * Genera una respuesta de error. Siempre lanza una ValidationException.
     * Incluye un 'report' con mensaje y tipo, y opcionalmente un error para un campo específico.
     */
    public static function error(string $message, ?string $field = null)
    {
        if ($field !== null) {
            $errorMessages = [
                'report_message' => $message, 
                'report_type' => 'error',    
                $field => $message,         
            ];
            throw ValidationException::withMessages($errorMessages);
        }

        throw new ReportableException($message, 'error');
    }
}
