import ModalAvaliacao, { ModalAvaliacaoProps } from "./ModalAvaliacao";
import BotaoAvaliacao from "./BotaoAvaliacao";
import EstrelaAvaliacao from "./EstrelaAvaliacao";

export { ModalAvaliacao, BotaoAvaliacao, EstrelaAvaliacao };

export function ModalFazerAvaliacao(
  props: Omit<ModalAvaliacaoProps, "avaliacaoExistente" | "onDeletar">
) {
  return <ModalAvaliacao {...props} avaliacaoExistente={null} />;
}

export function ModalEditarAvaliacao(
  props: ModalAvaliacaoProps
) {
  return <ModalAvaliacao {...props} />;
}

export default ModalAvaliacao;
