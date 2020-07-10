const getDifference = (firstNode, secondNode) => {
  let dx = abs(firstNode.row - secondNode.row);
  let dy = abs(firstNode.col - secondNode.col);
  let delta = [dx, dy];
  return delta;
};
//Manhattan Distance
//For only FOUR DIRECTIONs
const ManhattanDistance = (firstNode, secondNode) => {
  let delta = getDifference(firstNode, secondNode);
  return delta[0] + delta[1];
};
//Euclidean Distance
//For when we are allowed to move in ALL Directions
const EuclideanDistance = (firstNode, secondNode) => {
  let delta = getDifference(firstNode, secondNode);
  return Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);
};
// Chebyshev Distance
//For EIGHT DIRECTIONS 
const ChebyshevDistance = () => {
  let delta = getDifference(firstNode, secondNode);
  return max(delta[0], delta[1]);
};
