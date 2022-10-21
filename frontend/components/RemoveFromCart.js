/* eslint-disable prettier/prettier */
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { string } from 'prop-types';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--dark-orange);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  console.log(payload);
  cache.evict({ id: cache.identify(payload.data.deleteCartItem) });
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    optimisticResponse: {
      deleteCartItem: {
        __typename: 'CartItem',
        id,
      },
    },
  });
  return (
    <BigButton
      onClick={removeFromCart}
      disabled={loading}
      type='button'
      title='Remove this item from cart'
    >
      &times;
    </BigButton>
  );
}

RemoveFromCart.propTypes = {
  id: string,
};
