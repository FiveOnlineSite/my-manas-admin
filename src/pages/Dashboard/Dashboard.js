import React from "react";
import Head from "../../layout/head/Head";
import {
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
} from "../../components/Component";
import Content from "../../layout/content/Content";

const Dashboard = () => {
  return (
    <>
      <Head title='Achievements Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Dashboard{" "}
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Welcome to My Manas Foundation</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
      </Content>
    </>
  );
};

export default Dashboard;
