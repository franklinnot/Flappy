export default function ApplicationLogo({className = '', ...props}) {
    /**
     * Componente que muestra el logo de la aplicación
     * Utiliza el archivo SVG ubicado en la carpeta public
     */
    return (
        <img
            src="/favicon.svg"
            alt="Flappy Logo"
            className={className}
            {...props}
        />
    );
}
