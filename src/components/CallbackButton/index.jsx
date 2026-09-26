import { useState, useId, createElement, isValidElement } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import "./style.css";

/**
 * Componente genérico de botão que executa uma função de callback passando parâmetros.
 *
 * Pode disparar a ação diretamente ou abrir um modal de confirmação prévia
 * (caso `modalTitle`, `confirmModal`, etc. sejam informados).
 *
 * Props:
 * - name / label: Texto exibido no botão principal (ex: "Excluir", "Aprovar")
 * - icon: Ícone opcional do botão (componente Lucide, JSX element ou função)
 * - iconOnly: Se true, exibe botão compacto apenas com ícone
 * - variant: "primary" | "secondary" | "outline" | "danger" | "danger-outline" (padrão: "primary")
 * - className: Classes CSS adicionais para o botão principal
 * - style: Estilos inline para o botão principal
 * - disabled: Desabilita o botão
 * - serviceFn / callbackFn / actionFn / fn / action / callback: Função a ser executada ao clicar/confirmar
 * - params / parameters / args: Parâmetro(s) a serem repassados à função. Se for array, é descompactado via spread `fn(...params)`
 * - onSuccess: Callback executado após a conclusão bem-sucedida da função
 * - onError: Callback executado em caso de erro
 * - modalTitle: Título do modal de confirmação (se informado, ativa o modal)
 * - modalSubtitle: Subtítulo descritivo no modal
 * - modalMessage / confirmMessage: Mensagem no corpo do modal
 * - submitText / confirmText: Texto do botão de confirmação do modal (padrão: "Confirmar" ou name/label)
 * - cancelText: Texto do botão de cancelamento (padrão: "Cancelar")
 * - confirmModal / requireConfirm: Força exibição de modal de confirmação
 * - modalClassName: Classes CSS adicionais para a janela do modal
 * - overlayClassName: Classes CSS adicionais para o backdrop do modal
 * - children: Conteúdo filho alternativo para o interior do botão
 */
function CallbackButton({
  name,
  label,
  children,
  icon,
  iconOnly = false,
  variant = "primary",
  className = "",
  style,
  disabled = false,
  serviceFn,
  callbackFn,
  actionFn,
  fn,
  action,
  callback,
  onClick,
  onSubmit,
  params,
  parameters,
  args,
  onSuccess,
  onError,
  modalTitle,
  modalSubtitle,
  modalMessage,
  confirmMessage,
  submitText,
  confirmText,
  cancelText = "Cancelar",
  confirmModal,
  requireConfirm,
  modalClassName = "",
  overlayClassName = "",
  ...props
}) {
  const modalId = useId();
  const buttonLabel = name || label || children;
  const actionFunction =
    serviceFn ||
    callbackFn ||
    actionFn ||
    fn ||
    action ||
    callback ||
    onSubmit ||
    onClick;

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasModal = Boolean(
    confirmModal ||
      requireConfirm ||
      modalTitle ||
      modalSubtitle ||
      modalMessage ||
      confirmMessage
  );

  const title =
    modalTitle ||
    (typeof buttonLabel === "string" ? buttonLabel : "Confirmação");

  const messageText =
    modalMessage ||
    confirmMessage ||
    (modalSubtitle ? `Tem certeza que deseja prosseguir com a ação para "${modalSubtitle}"?` : "Tem certeza que deseja confirmar esta operação?");

  const confirmBtnText =
    submitText ||
    confirmText ||
    (typeof buttonLabel === "string" ? buttonLabel : "Confirmar");

  const isDangerAction =
    variant === "danger" ||
    variant === "danger-outline" ||
    (typeof confirmBtnText === "string" &&
      confirmBtnText.toLowerCase().includes("excluir")) ||
    (typeof title === "string" &&
      title.toLowerCase().includes("excluir"));

  const handleExecute = async () => {
    if (typeof actionFunction !== "function") {
      console.warn("[CallbackButton] Nenhuma função válida fornecida.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const rawParams =
        params !== undefined
          ? params
          : parameters !== undefined
          ? parameters
          : args;

      let result;
      if (rawParams !== undefined) {
        if (Array.isArray(rawParams)) {
          result = await actionFunction(...rawParams);
        } else {
          result = await actionFunction(rawParams);
        }
      } else {
        result = await actionFunction();
      }

      if (typeof onSuccess === "function") {
        onSuccess(result);
      }

      setIsOpen(false);
      return result;
    } catch (error) {
      console.error("[CallbackButton] Erro ao executar ação:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Ocorreu um erro ao processar a solicitação.";
      setErrorMessage(msg);

      if (typeof onError === "function") {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = (e) => {
    if (disabled || isSubmitting) return;

    if (hasModal) {
      setErrorMessage("");
      setIsOpen(true);
    } else {
      handleExecute();
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setErrorMessage("");
  };

  const renderIcon = () => {
    if (isSubmitting && !hasModal) {
      return <Loader2 size={16} className="cb-btn__spinner" />;
    }
    if (icon === null) return null;
    if (icon) {
      if (isValidElement(icon)) {
        return <span className="cb-btn__icon-wrapper">{icon}</span>;
      }
      if (typeof icon === "function" || (typeof icon === "object" && icon !== null)) {
        return createElement(icon, { size: 16, className: "cb-btn__icon" });
      }
      return <span className="cb-btn__icon-wrapper">{icon}</span>;
    }
    return null;
  };

  return (
    <>
      <button
        type="button"
        className={`cb-btn cb-btn--${variant} ${
          iconOnly ? "cb-btn--icon-only" : ""
        } ${className}`.trim()}
        style={style}
        onClick={handleButtonClick}
        disabled={disabled || isSubmitting}
        {...props}
      >
        {renderIcon()}
        {buttonLabel && !iconOnly && (
          <span className="cb-btn__label">{buttonLabel}</span>
        )}
      </button>

      {isOpen && (
        <div
          className={`cb-modal-overlay ${overlayClassName}`.trim()}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${modalId}-title`}
        >
          <div
            className={`cb-modal ${modalClassName}`.trim()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="cb-modal__header">
              <div className="cb-modal__header-info">
                <h2 id={`${modalId}-title`} className="cb-modal__title">
                  {title}
                </h2>
                {modalSubtitle && (
                  <p className="cb-modal__subtitle">{modalSubtitle}</p>
                )}
              </div>
              <button
                type="button"
                className="cb-modal__close-btn"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mensagem e Erros */}
            <div className="cb-modal__body">
              {errorMessage && (
                <div className="cb-modal__alert cb-modal__alert--error">
                  <AlertCircle size={16} className="cb-modal__alert-icon" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {messageText && (
                <p className="cb-modal__message">{messageText}</p>
              )}
            </div>

            {/* Rodapé com botões de Ação */}
            <div className="cb-modal__footer">
              <button
                type="button"
                className="cb-modal__btn cb-modal__btn--cancel"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`cb-modal__btn ${
                  isDangerAction ? "cb-modal__btn--danger" : "cb-modal__btn--submit"
                }`}
                onClick={handleExecute}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 size={16} className="cb-modal__spinner" />
                )}
                <span>{isSubmitting ? "Processando..." : confirmBtnText}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CallbackButton;
