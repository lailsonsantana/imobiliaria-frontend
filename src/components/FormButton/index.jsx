import { useState, useEffect, useId, createElement, isValidElement } from "react";
import { Plus, X, Loader2, AlertCircle, Trash2 } from "lucide-react";
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
 *         type: 'text',                // text | number | email | date | select | textarea | checkbox | tel | password | array | list
 *         placeholder: 'Digite...',    // texto placeholder (opcional)
 *         defaultValue: '',            // valor inicial (opcional)
 *         required: true,              // se o campo é obrigatório (opcional)
 *         options: ['Opção 1', ...],   // opções para select (array de strings ou [{ label, value }])
 *         rows: 3,                     // linhas para textarea (opcional)
 *         fullWidth: false,            // se true, ocupa a largura total no grid (opcional)
 *         min, max, step: ...,         // restrições numéricas/datas (opcional)
 *         disabled: false,             // desabilita o campo (opcional)
 *         helperText: 'Info...',       // texto de ajuda abaixo do campo (opcional)
 *         itemLabel: 'Telefone',       // rótulo do item para tipo array/list (opcional)
 *         minItems: 1,                 // quantidade mínima de itens no array (opcional)
 *         fields: [ ... ],             // sub-campos para tipo array/list
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
 * - initialValues: Objeto opcional pré-preenchido ao abrir (edição). Datas DD/MM/YYYY
 *   e arrays vazios são normalizados automaticamente conforme os entries.
 * - iconOnly: Se true, botão compacto só com ícone (útil em tabelas)
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
  initialValues,
  iconOnly = false,
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

  const createEmptyArrayItem = (subFields = []) => {
    const item = {};
    subFields.forEach((sf) => {
      if (sf.defaultValue !== undefined) {
        item[sf.name] = sf.defaultValue;
      } else if (sf.type === "checkbox") {
        item[sf.name] = false;
      } else {
        item[sf.name] = "";
      }
    });
    return item;
  };

  const cloneFieldValue = (value) => {
    if (Array.isArray(value)) {
      return JSON.parse(JSON.stringify(value));
    }
    if (typeof value === "object" && value !== null) {
      return { ...value };
    }
    return value;
  };

  /** DD/MM/YYYY → YYYY-MM-DD para inputs type="date" */
  const parseDateForInput = (value) => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value !== "string") return value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [d, m, y] = value.split("/");
      return `${y}-${m}-${d}`;
    }
    return value;
  };

  const emptyScalarForField = (fieldDef) => {
    if (fieldDef?.type === "checkbox") return false;
    return "";
  };

  const normalizeValueForEntry = (entry, value) => {
    if (entry.type === "date") {
      return parseDateForInput(value);
    }

    if (entry.type === "array" || entry.type === "list") {
      const subDefs = entry.fields || entry.subFields || entry.items || [];
      const minCount = entry.minItems !== undefined ? entry.minItems : 0;
      const list = Array.isArray(value) ? value : [];
      const normalized = list.map((item) => {
        const row =
          item && typeof item === "object" ? { ...item } : {};
        subDefs.forEach((sf) => {
          const raw = row[sf.name];
          row[sf.name] =
            raw === null || raw === undefined
              ? emptyScalarForField(sf)
              : normalizeValueForEntry(sf, raw);
        });
        return row;
      });
      while (normalized.length < minCount) {
        normalized.push(createEmptyArrayItem(subDefs));
      }
      return normalized;
    }

    if (entry.type === "checkbox") {
      return Boolean(value);
    }

    if (value === null || value === undefined) {
      return emptyScalarForField(entry);
    }

    return value;
  };

  const applyEntryNormalization = (data) => {
    formEntries.forEach((entry) => {
      if (!entry.name || !(entry.name in data)) return;
      data[entry.name] = normalizeValueForEntry(entry, data[entry.name]);
    });
  };

  // Inicializa o estado do formulário com os valores padrão dos campos
  const initializeFormData = (valuesOverride) => {
    const initial = {};
    formEntries.forEach((entry) => {
      if (entry.name) {
        if (entry.defaultValue !== undefined) {
          initial[entry.name] = cloneFieldValue(entry.defaultValue);
        } else if (entry.type === "checkbox") {
          initial[entry.name] = false;
        } else if (entry.type === "array" || entry.type === "list") {
          const subDefs = entry.fields || entry.subFields || entry.items || [];
          const minCount = entry.minItems !== undefined ? entry.minItems : 1;
          initial[entry.name] = Array.from({ length: minCount }, () => createEmptyArrayItem(subDefs));
        } else {
          initial[entry.name] = "";
        }
      }
    });

    const source =
      valuesOverride !== undefined ? valuesOverride : initialValues;
    if (source && typeof source === "object") {
      Object.keys(source).forEach((key) => {
        const val = source[key];
        if (val !== undefined && val !== null) {
          initial[key] = cloneFieldValue(val);
        }
      });
    }

    applyEntryNormalization(initial);

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

  const handleArrayItemChange = (arrayName, index, fieldName, value, fieldType) => {
    let finalValue = fieldType === "checkbox" ? value : value;

    if (fieldType === "number" && value !== "") {
      finalValue = Number(value);
    }

    setFormData((prev) => {
      const currentList = prev[arrayName] ? [...prev[arrayName]] : [];
      const currentItem = { ...(currentList[index] || {}) };
      currentItem[fieldName] = finalValue;
      currentList[index] = currentItem;
      return {
        ...prev,
        [arrayName]: currentList,
      };
    });
  };

  const handleAddArrayItem = (entry) => {
    const subDefs = entry.fields || entry.subFields || entry.items || [];
    const newItem = createEmptyArrayItem(subDefs);
    setFormData((prev) => ({
      ...prev,
      [entry.name]: [...(prev[entry.name] || []), newItem],
    }));
  };

  const handleRemoveArrayItem = (arrayName, index, minItems = 0) => {
    setFormData((prev) => {
      const currentList = prev[arrayName] ? [...prev[arrayName]] : [];
      if (currentList.length <= minItems) return prev;
      currentList.splice(index, 1);
      return {
        ...prev,
        [arrayName]: currentList,
      };
    });
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
      if (isValidElement(icon)) {
        return <span className="form-btn__icon-wrapper">{icon}</span>;
      }
      if (typeof icon === "function" || (typeof icon === "object" && icon !== null)) {
        return createElement(icon, { size: 16, className: "form-btn__icon" });
      }
      return <span className="form-btn__icon-wrapper">{icon}</span>;
    }
    return <Plus size={16} className="form-btn__icon" />;
  };

  return (
    <>
      <button
        type="button"
        className={`form-btn form-btn--${variant} ${iconOnly ? "form-btn--icon-only" : ""} ${className}`.trim()}
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
                    const isArrayType = entry.type === "array" || entry.type === "list";
                    const isFullWidth =
                      entry.fullWidth ||
                      entry.type === "textarea" ||
                      isArrayType ||
                      entry.colSpan === 2;

                    if (isArrayType) {
                      const subDefs = entry.fields || entry.subFields || entry.items || [];
                      const items = formData[entry.name] || [];
                      const minItems = entry.minItems !== undefined ? entry.minItems : 0;
                      const itemLabel = entry.itemLabel || "Item";

                      return (
                        <div
                          key={entry.name}
                          className="form-modal__field form-modal__field--full form-modal__array-container"
                        >
                          <div className="form-modal__array-header">
                            <div>
                              <span className="form-modal__array-title">
                                {entry.label || entry.name}
                              </span>
                              {entry.required && (
                                <span
                                  className="form-modal__required"
                                  title="Campo obrigatório"
                                >
                                  *
                                </span>
                              )}
                              {entry.helperText && (
                                <p className="form-modal__helper-text">
                                  {entry.helperText}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className="form-modal__array-add-btn"
                              onClick={() => handleAddArrayItem(entry)}
                              disabled={isSubmitting}
                            >
                              <Plus size={14} />
                              <span>Adicionar {itemLabel}</span>
                            </button>
                          </div>

                          <div className="form-modal__array-list">
                            {items.map((item, itemIdx) => {
                              const canRemove = items.length > minItems;
                              return (
                                <div
                                  key={`${entry.name}-${itemIdx}`}
                                  className="form-modal__array-card"
                                >
                                  <div className="form-modal__array-card-header">
                                    <span className="form-modal__array-card-title">
                                      {itemLabel} #{itemIdx + 1}
                                    </span>
                                    {canRemove && (
                                      <button
                                        type="button"
                                        className="form-modal__array-remove-btn"
                                        onClick={() =>
                                          handleRemoveArrayItem(
                                            entry.name,
                                            itemIdx,
                                            minItems
                                          )
                                        }
                                        disabled={isSubmitting}
                                        title={`Remover ${itemLabel}`}
                                      >
                                        <Trash2 size={14} />
                                        <span>Remover</span>
                                      </button>
                                    )}
                                  </div>

                                  <div className="form-modal__grid form-modal__array-subgrid">
                                    {subDefs.map((sf) => {
                                      const subFieldId = `${fieldId}-${itemIdx}-${sf.name}`;
                                      const sfFullWidth =
                                        sf.fullWidth || sf.type === "textarea" || sf.colSpan === 2;
                                      const sfCheckbox = sf.type === "checkbox";

                                      return (
                                        <div
                                          key={sf.name}
                                          className={`form-modal__field ${
                                            sfFullWidth ? "form-modal__field--full" : ""
                                          } ${sfCheckbox ? "form-modal__field--checkbox" : ""}`}
                                        >
                                          {!sfCheckbox && sf.label && (
                                            <label
                                              htmlFor={subFieldId}
                                              className="form-modal__label"
                                            >
                                              {sf.label}
                                              {sf.required && (
                                                <span
                                                  className="form-modal__required"
                                                  title="Campo obrigatório"
                                                >
                                                  *
                                                </span>
                                              )}
                                            </label>
                                          )}

                                          {sf.type === "select" ? (
                                            <select
                                              id={subFieldId}
                                              value={item[sf.name] ?? ""}
                                              onChange={(e) =>
                                                handleArrayItemChange(
                                                  entry.name,
                                                  itemIdx,
                                                  sf.name,
                                                  e.target.value,
                                                  sf.type
                                                )
                                              }
                                              required={sf.required}
                                              disabled={sf.disabled || isSubmitting}
                                              className="form-modal__input form-modal__select"
                                            >
                                              {sf.placeholder && (
                                                <option value="" disabled>
                                                  {sf.placeholder}
                                                </option>
                                              )}
                                              {sf.options?.map((opt) => {
                                                const optVal =
                                                  typeof opt === "object" ? opt.value : opt;
                                                const optLabel =
                                                  typeof opt === "object" ? opt.label : opt;
                                                return (
                                                  <option
                                                    key={String(optVal)}
                                                    value={optVal}
                                                  >
                                                    {optLabel}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                          ) : sf.type === "textarea" ? (
                                            <textarea
                                              id={subFieldId}
                                              value={item[sf.name] ?? ""}
                                              onChange={(e) =>
                                                handleArrayItemChange(
                                                  entry.name,
                                                  itemIdx,
                                                  sf.name,
                                                  e.target.value,
                                                  sf.type
                                                )
                                              }
                                              placeholder={sf.placeholder}
                                              required={sf.required}
                                              rows={sf.rows || 2}
                                              disabled={sf.disabled || isSubmitting}
                                              className="form-modal__input form-modal__textarea"
                                            />
                                          ) : sfCheckbox ? (
                                            <label
                                              htmlFor={subFieldId}
                                              className="form-modal__checkbox-label"
                                            >
                                              <input
                                                type="checkbox"
                                                id={subFieldId}
                                                checked={Boolean(item[sf.name])}
                                                onChange={(e) =>
                                                  handleArrayItemChange(
                                                    entry.name,
                                                    itemIdx,
                                                    sf.name,
                                                    e.target.checked,
                                                    sf.type
                                                  )
                                                }
                                                required={sf.required}
                                                disabled={sf.disabled || isSubmitting}
                                                className="form-modal__checkbox"
                                              />
                                              <span>{sf.label}</span>
                                              {sf.required && (
                                                <span className="form-modal__required">*</span>
                                              )}
                                            </label>
                                          ) : (
                                            <input
                                              type={sf.type || "text"}
                                              id={subFieldId}
                                              value={item[sf.name] ?? ""}
                                              onChange={(e) =>
                                                handleArrayItemChange(
                                                  entry.name,
                                                  itemIdx,
                                                  sf.name,
                                                  e.target.value,
                                                  sf.type
                                                )
                                              }
                                              placeholder={sf.placeholder}
                                              required={sf.required}
                                              min={sf.min}
                                              max={sf.max}
                                              step={sf.step}
                                              disabled={sf.disabled || isSubmitting}
                                              className="form-modal__input"
                                            />
                                          )}

                                          {sf.helperText && (
                                            <span className="form-modal__helper-text">
                                              {sf.helperText}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

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