import ModalAvaliacao, { ModalAvaliacaoProps } from "./ModalAvaliacao";
import BotaoAvaliacao from "./BotaoAvaliacao";
import EstrelaAvaliacao from "./EstrelaAvaliacao";
import ModalEditarComentario from "./ModalEditarComentario";

export { ModalAvaliacao, BotaoAvaliacao, EstrelaAvaliacao, ModalEditarComentario };

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
