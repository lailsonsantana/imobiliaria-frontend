import { useState, useEffect, useId } from "react";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";
import "./style.css";

/**
 * Componente genérico de botão com popup de formulário (modal).
 *
 * Ao ser clicado, abre um modal contendo os campos ("entries") configurados
 * na sua instanciação. Ao submeter o formulário, os dados preenchidos são
 * reunidos em um objeto e enviados como payload (body) para a função de serviço
 * informada (ex: chamada de API).
 *
 * Props:
 * - name / label: Texto exibido no botão principal (ex: "Nova Venda", "Cadastrar Cliente")
 * - entries / fields: Array de objetos que definem os campos do formulário:
 *     [
 *       {
 *         name: 'nome',                // chave no objeto de dados (obrigatório)
 *         label: 'Nome Completo',       // rótulo do campo
 *         type: 'text',                // text | number | email | date | select | textarea | checkbox | tel | password
 *         placeholder: 'Digite...',    // texto placeholder (opcional)
 *         defaultValue: '',            // valor inicial (opcional)
 *         required: true,              // se o campo é obrigatório (opcional)
 *         options: ['Opção 1', ...],   // opções para select (array de strings ou [{ label, value }])
 *         rows: 3,                     // linhas para textarea (opcional)
 *         fullWidth: false,            // se true, ocupa a largura total no grid (opcional)
 *         min, max, step: ...,         // restrições numéricas/datas (opcional)
 *         disabled: false,             // desabilita o campo (opcional)
 *         helperText: 'Info...',       // texto de ajuda abaixo do campo (opcional)
 *       }
 *     ]
 * - serviceFn / onSubmit: Função assíncrona ou de serviço chamada no envio do formulário:
 *     (formData) => Promise<any> | any
 * - onSuccess: Callback executado após submissão bem-sucedida (ex: atualizar lista)
 * - onError: Callback executado em caso de erro na submissão
 * - icon: Ícone opcional no botão (padrão: ícone Plus do lucide-react)
 * - modalTitle: Título personalizado do modal (padrão: name do botão)
 * - modalSubtitle: Subtítulo descritivo do modal (opcional)
 * - submitText: Texto do botão de confirmação do modal (padrão: "Salvar")
 * - cancelText: Texto do botão de cancelamento (padrão: "Cancelar")
 * - variant: Estilo visual do botão ("primary" | "secondary" | "outline", padrão: "primary")
 * - className: Classes CSS adicionais para o botão principal
 * - modalClassName: Classes CSS adicionais para a janela do modal
 * - overlayClassName: Classes CSS adicionais para o backdrop do modal
 * - style: Estilos inline para o botão principal
 * - disabled: Desabilita o botão principal
 * - children: Conteúdo alternativo para o interior do botão (se não passar name/label)
 */
function FormButton({
  name,
  label,
  children,
  entries = [],
  fields,
  serviceFn,
  onSubmit,
  onSuccess,
  onError,
  icon,
  modalTitle,
  modalSubtitle,
  submitText = "Salvar",
  cancelText = "Cancelar",
  variant = "primary",
  className = "",
  modalClassName = "",
  overlayClassName = "",
  style,
  disabled = false,
  ...props
}) {
  const formEntries = fields || entries;
  const buttonLabel = name || label || children;
  const title = modalTitle || (typeof buttonLabel === "string" ? buttonLabel : "Formulário");
  const actionFn = serviceFn || onSubmit;
  const formId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Inicializa o estado do formulário com os valores padrão dos campos
  const initializeFormData = () => {
    const initial = {};
    formEntries.forEach((entry) => {
      if (entry.name) {
        if (entry.defaultValue !== undefined) {
          initial[entry.name] = entry.defaultValue;
        } else if (entry.type === "checkbox") {
          initial[entry.name] = false;
        } else {
          initial[entry.name] = "";
        }
      }
    });
    setFormData(initial);
    setErrorMessage("");
  };

  const handleOpen = () => {
    if (disabled) return;
    initializeFormData();
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setErrorMessage("");
  };

  // Fecha o modal ao pressionar Escape e previne rolagem do body quando aberto
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isSubmitting]);

  const handleChange = (e, entry) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (entry.type === "number" && value !== "") {
      finalValue = Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!actionFn) {
      handleClose();
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await actionFn(formData);
      if (onSuccess) {
        onSuccess(result, formData);
      }
      setIsOpen(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Ocorreu um erro ao processar o formulário. Tente novamente.";
      setErrorMessage(msg);
      if (onError) {
        onError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderiza ícone padrão se nenhum foi passado ou renderiza o ícone customizado
  const renderIcon = () => {
    if (icon === null) return null;
    if (icon) {
      return typeof icon === "function" ? (
        icon({ size: 16, className: "form-btn__icon" })
      ) : (
        <span className="form-btn__icon-wrapper">{icon}</span>
      );
    }
    return <Plus size={16} className="form-btn__icon" />;
  };

  return (
    <>
      <button
        type="button"
        className={`form-btn form-btn--${variant} ${className}`.trim()}
        style={style}
        onClick={handleOpen}
        disabled={disabled}
        {...props}
      >
        {renderIcon()}
        {buttonLabel && <span className="form-btn__label">{buttonLabel}</span>}
      </button>

      {isOpen && (
        <div
          className={`form-modal-overlay ${overlayClassName}`.trim()}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${formId}-title`}
        >
          <div
            className={`form-modal ${modalClassName}`.trim()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="form-modal__header">
              <div className="form-modal__header-info">
                <h2 id={`${formId}-title`} className="form-modal__title">
                  {title}
                </h2>
                {modalSubtitle && (
                  <p className="form-modal__subtitle">{modalSubtitle}</p>
                )}
              </div>
              <button
                type="button"
                className="form-modal__close-btn"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mensagem de Erro */}
            {errorMessage && (
              <div className="form-modal__alert form-modal__alert--error">
                <AlertCircle size={16} className="form-modal__alert-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Formulário com os campos configurados */}
            <form onSubmit={handleSubmit} className="form-modal__form">
              <div className="form-modal__body">
                <div className="form-modal__grid">
                  {formEntries.map((entry) => {
                    const fieldId = `${formId}-${entry.name}`;
                    const isCheckbox = entry.type === "checkbox";
                    const isFullWidth =
                      entry.fullWidth ||
                      entry.type === "textarea" ||
                      entry.colSpan === 2;

                    return (
                      <div
                        key={entry.name}
                        className={`form-modal__field ${
                          isFullWidth ? "form-modal__field--full" : ""
                        } ${isCheckbox ? "form-modal__field--checkbox" : ""}`}
                      >
                        {!isCheckbox && entry.label && (
                          <label
                            htmlFor={fieldId}
                            className="form-modal__label"
                          >
                            {entry.label}
                            {entry.required && (
                              <span
                                className="form-modal__required"
                                title="Campo obrigatório"
                              >
                                *
                              </span>
                            )}
                          </label>
                        )}

                        {/* Input Select */}
                        {entry.type === "select" ? (
                          <select
                            id={fieldId}
                            name={entry.name}
                            value={formData[entry.name] ?? ""}
                            onChange={(e) => handleChange(e, entry)}
                            required={entry.required}
                            disabled={entry.disabled || isSubmitting}
                            className="form-modal__input form-modal__select"
                          >
                            {entry.placeholder && (
                              <option value="" disabled>
                                {entry.placeholder}
                              </option>
                            )}
                            {entry.options?.map((opt) => {
                              const optVal =
                                typeof opt === "object" ? opt.value : opt;
                              const optLabel =
                                typeof opt === "object" ? opt.label : opt;
                              return (
                                <option key={String(optVal)} value={optVal}>
                                  {optLabel}
                                </option>
                              );
                            })}
                          </select>
                        ) : entry.type === "textarea" ? (
                          /* Input Textarea */
                          <textarea
                            id={fieldId}
                            name={entry.name}
                            value={formData[entry.name] ?? ""}
                            onChange={(e) => handleChange(e, entry)}
                            placeholder={entry.placeholder}
                            required={entry.required}
                            rows={entry.rows || 3}
                            disabled={entry.disabled || isSubmitting}
                            className="form-modal__input form-modal__textarea"
                          />
                        ) : isCheckbox ? (
                          /* Input Checkbox */
                          <label
                            htmlFor={fieldId}
                            className="form-modal__checkbox-label"
                          >
                            <input
                              type="checkbox"
                              id={fieldId}
                              name={entry.name}
                              checked={Boolean(formData[entry.name])}
                              onChange={(e) => handleChange(e, entry)}
                              required={entry.required}
                              disabled={entry.disabled || isSubmitting}
                              className="form-modal__checkbox"
                            />
                            <span>{entry.label}</span>
                            {entry.required && (
                              <span className="form-modal__required">*</span>
                            )}
                          </label>
                        ) : (
                          /* Inputs Padrão (text, number, email, date, etc) */
                          <input
                            type={entry.type || "text"}
                            id={fieldId}
                            name={entry.name}
                            value={formData[entry.name] ?? ""}
                            onChange={(e) => handleChange(e, entry)}
                            placeholder={entry.placeholder}
                            required={entry.required}
                            min={entry.min}
                            max={entry.max}
                            step={entry.step}
                            disabled={entry.disabled || isSubmitting}
                            className="form-modal__input"
                          />
                        )}

                        {entry.helperText && (
                          <span className="form-modal__helper-text">
                            {entry.helperText}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rodapé com botões de Ação */}
              <div className="form-modal__footer">
                <button
                  type="button"
                  className="form-modal__btn form-modal__btn--cancel"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  {cancelText}
                </button>
                <button
                  type="submit"
                  className="form-modal__btn form-modal__btn--submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 size={16} className="form-modal__spinner" />
                  )}
                  <span>{isSubmitting ? "Enviando..." : submitText}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FormButton;