import styled from "styled-components";

export const MovieContainer = styled.div`
  width: 364.67px;
  height: 548px;
  margin: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  padding: 12px;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  cursor: pointer;

    &:hover {
      width: 366.67px;
      height: 550px;
  }
`;

export const MovieImage = styled.img`
  width: 100%;
  height: 400px;
  border-radius: 10px 10px 0 0;
  object-fit: cover;
`;

export const MovieInfo = styled.div`
  padding: 10px;
  text-align: center;
`;

export const MovieTitle = styled.h2`
  font-size: 1.5em;
  margin: 10px 0;
`;

export const MovieRating = styled.div`
  font-size: 1.2em;
  margin: 5px 0;
  color: #ffa500;
`;

interface MovieButtonProps {
    added: boolean;
}

export const MovieButton = styled.button<MovieButtonProps>`
  width: 80%;
  margin: 10px auto;
  height: 46px;
  border-radius: 15px;
  background-color: ${(props) => (props.added ? "#ccc" : "#4caf50")};
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.added ? "#bbb" : "#45a049")};
  }
`;
