import React from "react";
import "./SearchInput.css";

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  loading,
  onClear,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="search-input">
      <label className="search-input__label" htmlFor="rfc-input">
        Ingresa RFCs (uno por línea, separados por coma o punto y coma)
      </label>

      <textarea
        id="rfc-input"
        className="search-input__textarea"
        placeholder="Ejemplo:&#10;AAA010101AAA&#10;BBB020202BBB&#10;CCC030303CCC"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        rows={6}
        disabled={loading}
      />

      <div className="search-input__actions">
        <button
          className="search-input__btn search-input__btn--clear"
          onClick={onClear}
          disabled={loading || !value.trim()}
          type="button"
        >
          🗑️ Limpiar
        </button>

        <button
          className="search-input__btn search-input__btn--search"
          onClick={onSearch}
          disabled={loading || !value.trim()}
          type="button"
        >
          {loading ? (
            <>
              <span className="search-input__spinner"></span>
              Consultando...
            </>
          ) : (
            <>🔍 Buscar</>
          )}
        </button>
      </div>

      <p className="search-input__hint">
        💡 Tip: Presiona Enter para buscar rápidamente
      </p>
    </div>
  );
};
