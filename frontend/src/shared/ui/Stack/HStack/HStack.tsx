import { Flex, FlexProps } from "../Flex/Flex";

type HStackProps = Omit<FlexProps, "direction">;

export const HStack = (props: HStackProps) => {
    const {
        children,
        ...otherProps
    } = props;

    return (
        <Flex direction="row" {...otherProps}>
            {children}
        </Flex>
    );
};
