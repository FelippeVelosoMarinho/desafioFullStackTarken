import { styled } from "styled-components";
import { theme } from "../styles/theme";

export const MainBox = styled.div`
  height: 100%;
  display: flex;
  padding: 120px;
  justify-content: start;
  flex-direction: column;
`;

export const CenterBox = styled.div`
  height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  color: ${theme.colors.grey};
`;
