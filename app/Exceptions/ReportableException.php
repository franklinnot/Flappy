<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Session;

/**
 * Excepción personalizada para mensajes de la aplicación que deben ser reportados al usuario
 * como un "toast" o notificación, generalmente redirigiendo de vuelta.
 */
class ReportableException extends Exception
{
    protected string $reportType; // Puede ser 'error', 'warning', 'info', etc.

    public function __construct(string $message, string $type = 'error', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->reportType = $type;
    }

    /**
     * Obtiene el tipo de reporte (ej. 'error', 'warning').
     */
    public function getReportType(): string
    {
        return $this->reportType;
    }

    /**
     * Renderiza la excepción en una respuesta HTTP.
     * Esta es la clave para que el "toast" general funcione sin un campo específico.
     * Laravel interceptará esta excepción y ejecutará este método.
     */
    public function render($request): RedirectResponse
    {
        Session::flash('report', [
            'message' => $this->getMessage(),
            'type' => $this->getReportType(),
        ]);

        // Redirige de vuelta a la página anterior.
        return redirect()->back();
    }
}
