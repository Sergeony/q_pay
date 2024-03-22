import { Flex, FlexProps } from "../Flex/Flex";

type VStackProps = Omit<FlexProps, "direction">;

export const VStack = (props: VStackProps) => {
    const {
        children,
        ...otherProps
    } = props;

    return (
        <Flex direction="column" {...otherProps}>
            {children}
        </Flex>
    );
};
