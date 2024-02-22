PGDMP  4    5             
    {            agro_auction    16.0    16.0 <               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16396    agro_auction    DATABASE     �   CREATE DATABASE agro_auction WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE agro_auction;
                postgres    false            �            1259    16397    auction    TABLE     �  CREATE TABLE public.auction (
    auctionid integer NOT NULL,
    productid integer,
    userid integer,
    reserveprice integer,
    weight character varying(255),
    highestbidderid integer,
    highestbid character varying(225),
    endtime character varying(255),
    status integer DEFAULT 1 NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.auction;
       public         heap    postgres    false            �            1259    16404    auction_auctionid_seq    SEQUENCE     �   CREATE SEQUENCE public.auction_auctionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.auction_auctionid_seq;
       public          postgres    false    215                       0    0    auction_auctionid_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.auction_auctionid_seq OWNED BY public.auction.auctionid;
          public          postgres    false    216            �            1259    16405    bidding    TABLE     
  CREATE TABLE public.bidding (
    biddingid integer NOT NULL,
    auctionid integer,
    userid integer,
    productid integer,
    price integer,
    status integer DEFAULT 1 NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.bidding;
       public         heap    postgres    false            �            1259    16410    bidding_biddingid_seq    SEQUENCE     �   CREATE SEQUENCE public.bidding_biddingid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.bidding_biddingid_seq;
       public          postgres    false    217                       0    0    bidding_biddingid_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.bidding_biddingid_seq OWNED BY public.bidding.biddingid;
          public          postgres    false    218            �            1259    16411    cart    TABLE     �  CREATE TABLE public.cart (
    id integer NOT NULL,
    userid integer,
    productid integer,
    weight integer NOT NULL,
    totalamount character varying(255) NOT NULL,
    ispaid integer DEFAULT 0,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    auction_id integer NOT NULL
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    16417    cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.cart_id_seq;
       public          postgres    false    219                       0    0    cart_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;
          public          postgres    false    220            �            1259    16418    chat    TABLE     �  CREATE TABLE public.chat (
    id integer NOT NULL,
    message character varying(255) NOT NULL,
    sender_id integer NOT NULL,
    reciever_id integer NOT NULL,
    isread integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status smallint DEFAULT 1 NOT NULL
);
    DROP TABLE public.chat;
       public         heap    postgres    false            �            1259    16425    chat_id_seq    SEQUENCE     �   CREATE SEQUENCE public.chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.chat_id_seq;
       public          postgres    false    221                       0    0    chat_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.chat_id_seq OWNED BY public.chat.id;
          public          postgres    false    222            �            1259    16426    products    TABLE     �  CREATE TABLE public.products (
    productid integer NOT NULL,
    title character varying(255),
    description character varying(255),
    rate character varying(255),
    weight character varying(255),
    userid integer,
    status integer DEFAULT 1 NOT NULL,
    image text NOT NULL,
    islisted integer DEFAULT 0 NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    weighttype character varying(255) DEFAULT 'grams'::character varying,
    auctionend timestamp without time zone,
    count integer,
    counttype character varying(255),
    volume integer,
    volumetype character varying(255),
    location character varying(255)
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    16435    products_productid_seq    SEQUENCE     �   CREATE SEQUENCE public.products_productid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.products_productid_seq;
       public          postgres    false    223                       0    0    products_productid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.products_productid_seq OWNED BY public.products.productid;
          public          postgres    false    224            �            1259    16436    review    TABLE     �  CREATE TABLE public.review (
    id integer NOT NULL,
    prod_id integer NOT NULL,
    user_id integer NOT NULL,
    auction_id integer NOT NULL,
    rating character varying(15) NOT NULL,
    feedback character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status smallint NOT NULL
);
    DROP TABLE public.review;
       public         heap    postgres    false            �            1259    16441    review_id_seq    SEQUENCE     �   CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.review_id_seq;
       public          postgres    false    225                       0    0    review_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;
          public          postgres    false    226            �            1259    16442    shipment    TABLE     �  CREATE TABLE public.shipment (
    shipid integer NOT NULL,
    address character varying(255),
    postalcode character varying(255),
    city character varying(255),
    country character varying(255),
    userid integer,
    productid integer,
    quantity character varying(255) NOT NULL,
    payment integer DEFAULT 0 NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.shipment;
       public         heap    postgres    false            �            1259    16450    shipment_shipid_seq    SEQUENCE     �   CREATE SEQUENCE public.shipment_shipid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.shipment_shipid_seq;
       public          postgres    false    227                       0    0    shipment_shipid_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.shipment_shipid_seq OWNED BY public.shipment.shipid;
          public          postgres    false    228            �            1259    16451    users    TABLE     �  CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(255),
    description character varying(255),
    cnic character varying(255),
    email character varying(255),
    password character varying(255),
    role character varying(255),
    location character varying(255),
    status integer DEFAULT 1 NOT NULL,
    image text NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16458    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    229                       0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    230            =           2604    16459    auction auctionid    DEFAULT     v   ALTER TABLE ONLY public.auction ALTER COLUMN auctionid SET DEFAULT nextval('public.auction_auctionid_seq'::regclass);
 @   ALTER TABLE public.auction ALTER COLUMN auctionid DROP DEFAULT;
       public          postgres    false    216    215            @           2604    16460    bidding biddingid    DEFAULT     v   ALTER TABLE ONLY public.bidding ALTER COLUMN biddingid SET DEFAULT nextval('public.bidding_biddingid_seq'::regclass);
 @   ALTER TABLE public.bidding ALTER COLUMN biddingid DROP DEFAULT;
       public          postgres    false    218    217            C           2604    16461    cart id    DEFAULT     b   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            G           2604    16462    chat id    DEFAULT     b   ALTER TABLE ONLY public.chat ALTER COLUMN id SET DEFAULT nextval('public.chat_id_seq'::regclass);
 6   ALTER TABLE public.chat ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221            L           2604    16463    products productid    DEFAULT     x   ALTER TABLE ONLY public.products ALTER COLUMN productid SET DEFAULT nextval('public.products_productid_seq'::regclass);
 A   ALTER TABLE public.products ALTER COLUMN productid DROP DEFAULT;
       public          postgres    false    224    223            Q           2604    16464 	   review id    DEFAULT     f   ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);
 8   ALTER TABLE public.review ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225            T           2604    16465    shipment shipid    DEFAULT     r   ALTER TABLE ONLY public.shipment ALTER COLUMN shipid SET DEFAULT nextval('public.shipment_shipid_seq'::regclass);
 >   ALTER TABLE public.shipment ALTER COLUMN shipid DROP DEFAULT;
       public          postgres    false    228    227            X           2604    16466    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    230    229            �          0    16397    auction 
   TABLE DATA           �   COPY public.auction (auctionid, productid, userid, reserveprice, weight, highestbidderid, highestbid, endtime, status, createdat) FROM stdin;
    public          postgres    false    215   ?I       �          0    16405    bidding 
   TABLE DATA           d   COPY public.bidding (biddingid, auctionid, userid, productid, price, status, createdat) FROM stdin;
    public          postgres    false    217   \L       �          0    16411    cart 
   TABLE DATA           u   COPY public.cart (id, userid, productid, weight, totalamount, ispaid, createdat, updated_at, auction_id) FROM stdin;
    public          postgres    false    219   �L                  0    16418    chat 
   TABLE DATA           k   COPY public.chat (id, message, sender_id, reciever_id, isread, created_at, updated_at, status) FROM stdin;
    public          postgres    false    221   �M                 0    16426    products 
   TABLE DATA           �   COPY public.products (productid, title, description, rate, weight, userid, status, image, islisted, createdat, weighttype, auctionend, count, counttype, volume, volumetype, location) FROM stdin;
    public          postgres    false    223   �S                 0    16436    review 
   TABLE DATA           t   COPY public.review (id, prod_id, user_id, auction_id, rating, feedback, created_at, updated_at, status) FROM stdin;
    public          postgres    false    225   �U                 0    16442    shipment 
   TABLE DATA           �   COPY public.shipment (shipid, address, postalcode, city, country, userid, productid, quantity, payment, status, createdat) FROM stdin;
    public          postgres    false    227   �U                 0    16451    users 
   TABLE DATA              COPY public.users (userid, username, description, cnic, email, password, role, location, status, image, createdat) FROM stdin;
    public          postgres    false    229   	V                  0    0    auction_auctionid_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.auction_auctionid_seq', 88, true);
          public          postgres    false    216                       0    0    bidding_biddingid_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.bidding_biddingid_seq', 42, true);
          public          postgres    false    218                       0    0    cart_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.cart_id_seq', 11, true);
          public          postgres    false    220                       0    0    chat_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.chat_id_seq', 99, true);
          public          postgres    false    222                       0    0    products_productid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.products_productid_seq', 19, true);
          public          postgres    false    224                       0    0    review_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.review_id_seq', 1, false);
          public          postgres    false    226                       0    0    shipment_shipid_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.shipment_shipid_seq', 1, false);
          public          postgres    false    228                       0    0    users_userid_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_userid_seq', 25, true);
          public          postgres    false    230            \           2606    16468    auction auction_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.auction
    ADD CONSTRAINT auction_pkey PRIMARY KEY (auctionid);
 >   ALTER TABLE ONLY public.auction DROP CONSTRAINT auction_pkey;
       public            postgres    false    215            ^           2606    16470    bidding bidding_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.bidding
    ADD CONSTRAINT bidding_pkey PRIMARY KEY (biddingid);
 >   ALTER TABLE ONLY public.bidding DROP CONSTRAINT bidding_pkey;
       public            postgres    false    217            `           2606    16472    cart cart_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    219            b           2606    16474    chat chat_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_pkey;
       public            postgres    false    221            d           2606    16476    products products_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (productid);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    223            f           2606    16478    review review_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.review DROP CONSTRAINT review_pkey;
       public            postgres    false    225            h           2606    16480    shipment shipment_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.shipment
    ADD CONSTRAINT shipment_pkey PRIMARY KEY (shipid);
 @   ALTER TABLE ONLY public.shipment DROP CONSTRAINT shipment_pkey;
       public            postgres    false    227            j           2606    16482    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    229            �     x����"K�SQ��������6�8�X.{��F���)���b���¢�߿_�O�_L_�W�C�`�F+W��b��)�zȚ��̇�b��`��&"<�Mt�^�	���>Ӣ5�^��� w �0O�[��Cd;�]��"��J��u���6��d��h���d�1�5���YI��M��:8f��a{iR(�L�a�U[�P��<��&bk�R.��G�� >�'�ˇmdHtͣ���:��RW�C�5ˈ`�t�?��_�%��)#99�Ն�<+OƠp�ѱ:\�8�:�����_h]���΀��Y��B��_�w�ҕ	�<�� ��3�
ȇJ~��'�ާ*w������!�3,+V[��8�6�ߧZ������A[����*�/ȹ]
��)r�#ڤz u��$Q<Gt��#�:>Q(��W�r����0�ʖ4�/2��d�I���K0'w��O��# �I+��;Dn��z�Fmȋ���6y� ��B^|�`��K�؝�S���v��1�?�$lb��C��H���]���}d��a��BN}eNc�1��[u�]֭,?0��s���A��L(���N��baQ#o��\�s�R�z¬����s�C!'�މ�O�U�ᩎ��둦[����ى�2D5G�_��hv�� �E|%j'�=���F�+��hO�{�P�f��=F{|.����ܞ5��k*6�l����0*�>`cQ�o�{�t��;���7���� ��M���6ŋ]�g��c�?�6      �   G   x�=ʱ !�:��@�(�?�����-ӳ�&(:�+Y���H;�i��!;�(i@�9�w�A�      �   �   x�}�ۭ� D�Mi ���r���ZY��m��b<�H�	�4�	$,zr��^)+a�w��Ȫ�&�NHb���ӵ��uJ=�N�;�����3�_5��8�S4�z��`'���ߥ�n���6����8H��y_�S7
Z\�����	ư����
U�|sj�f��E��wj#�:��7�%�d�1�
��^c������ �_���Щ����zk���%          �  x���Mo�6���_�P3C��S�mri�4���Nǉ�����ʱwe-E�H��>��%j8�Z����|ۅ�w�	�?b:��>��\��j�WLݛ!��us�_���}�#��y-��t���p���mZ�?÷�N����#�?�'��m��� wv�ߜ���oD��)K�ZCH
�8懠�����rV��"Ct�B�\CȈ��Λ��{PF�H��hR�!d��|{^�k�K���Bl�B�Z�eO^��x%4�����ޅDF�u������PL@��L�4�B�t���Q]sr�-���>@��ݧ�]b9�2B��df0qM�(k���� !Dg/$�U� y��<@ȈxS~������|��rvy�_o���7����U��j������������0���W�I�@�����$v�TC���g�I�� ��EG1&�5�+O/!�H)Rad{?_6�7e-M�ǘ@%/��ˮ9)��̿��W����A�)����G�-��L�-�*K@�d5Yc�x��z`����e��3r��P*h6c�!8�H�s"2e�!8�I�3�Pi�;gcQiuF�ާ�U��>t&fX¢ڸ{9D�i�M�2V+�J\Cp6��W�g']����g��x��y��RCp5V��+;�GK��X<���M���(�k��j��_����g��X:�.�(�T��Ƃ�d����\��bɥ�"̌1���@,�R���x��Mǒ�,�j��X=��D����Cp�oYomۋ���� N2�Ma�Urɥ�z.h��j��Z��]onn6�s�bN"��c6���v~P��r#���+�v���'�Eg�4x��9c�Z�y������lݐ�z�����?����߯���M��e8��`�h�ں3i�ʉ��x[�(��X'e~�`mݫ4[3��>���ۖF+;�)ǒu�`����ϧ��s�a{1�M�+u������dH�dk22G�k��ӌ��Ny�5���b������z9����x8 ?^qȒ��`k,#K����y�T����l�h�w�p��X8�mF�f��x�Ƃ͓���n�+"�ŲM%Ү�("�Ĳ-�z+��=����X���˶;[c�X�������v���dɆZՂ�!�^�� M����l/SK�I���m�`{�y�Z�b�&L�A���Y)�H�1X�*7V�fi����� }��ǬT��f�A*�Y�����>~~�(�]�D��=Bb�!�`-��|��ҰO��R�!h��~�j�#�s�!h[N۵bC�!h����C°��$J!c��GU��3�ð/6�hӣ��9St)dl�j�G� s��Ӈ��W��Ձ̻bR�PCp=���w�d��"�������K�>�a�!3?pS5]c�Xԙ��KA�X*�t�iX����#�KD��G�\!�5��2�4(���t�%�A���o֋��:Ҡ�,QJ�r����6f���M|a
���q���^r�         �  x���ݎ�@���SL������V��l��ޭT�%
i�%�x�z��0ۊ������X��]�Ы�Ա;l~}T�WöV�C��y�A�v�n�o�S��!bb�O����	�a�BҔM����������E�[<�?|R_?�z�Z��j��\���  Mg��q�4C�_9���9_�A
la�D��'�VM�=���'�x��D�Ǳ��E6�-������,��8_�^�����"��A|�1.�S�I�`K|�
|�3sض�/T���f��R򑝰�p�#)���vAc���~UP�g�������0͘-c�)��T1`�t��2Em.2�����i�F.��&�_D>�˗u#n��<%}������\ĚR�(��[���Ӌ��aNLh�$2�􈱵�F�W$����z�̕$�7����`(�n6�b�l��N��b����0H��}#�v�%<�:�D)JJ�(G�8d���RK���I��I�f���>�         [   x�u˱�0C�ڞ����`	J���AA�j���*���"Z�� �D���<Ҕ�ۛ���R�t��MH6���M��	���o��%�            x������ � �         t  x���]������W���NK7�|x5"*"������ ��
�¯?��8g&kM�+���݉��[�V۹����>��g�'i���Sv���m�C���>���[���lu��� �@�K����F2b��(h���t�2,ڋa'�~�^��d~��9� �? ��o��C���	'p��_H�<�������XƵ ���6�!Cw?��@ ��Q���s���6֖o��Pɾ���`,��β�׵�������b�^_���Ŀ��j��N� ��0GQ� nw��l9~ k��f)��.�̳��Z>�*|����>�GP��̳�����#�VMkU�����-� 1�:���_���$4ˁ��c�ú~��eZ�0n�ʊ"��.������^7��*�䗘���lE���0��\Z��ZNs� G��}���x�\���g!����[?R�Qe���m�BGҁ��LT�Y-��^x;]�a�Y��D,CQ_P�P�8 $�bW|���T�#��@����l�z�G��U%7���4����K"_��6e��r�}I+"Ҥ�.d:oy��/�"�#�K��䋅���",o�.t��m/�&�w�P2GT_�2�ӧ��}��	aJօ��aF_�\~Jw~�����5�o�T�a=��N;� ^o�8�^M��i���%��r���0_Q�Y�'<8��Q�����]~*��PNW~s��x��4����I�͙�iO\���ӕ�j���f��T��1L+&ԃ�؅,U'y�!�0���@�0n���G��<^��9&:�xߜ��i�ػ�62N5�2OB��%��2��������}D)@"�b��{1}����p�}��S6=o�k��~**��(MV��	��at'�r��7ɽ<�wD\F ���9G:�*�����/UXU��ɧQ9e�����~ől��pp��oxs��Vc;��x\���,ݱ�k���@iT������1Ò.���O�S��0�eM�uq���f�Tg�gwy��b�+c�ߓX�L<�{�lNB���>�K�����s��1�d�J�Gy\���s�<���$�����G��k�Iw�3e��P9�a�e�P�#�'6)�e���dc�3Ҷ�L�꠯��H:��	_Ked�zp4�R�9|6��7H��	��`�⻑_
��k�"^J~[e�)Q���jB�'N�A�UqVʵR8�0+�u�d�>'�+�#XZB�.b:4�ވ��s�ݭ��>k�W�X�Ɉ3�TE�z���˗nt�H��&�����j�JD�8�(�;�E5��ŷE g���燋hc�#.�"�ٴ���Sr7���ό���!:�Њ�P�g�Ǵ]���^�~�~|:�6��ZT�ةױ�OG��jL�J�m���qģ��o�П��͜U�t�+j��S6��l�j���	�ʨ�3�M�]��Ծ~q������E�)\�L��aqk�=Zc�E����'��Q��ay�l�ݥ��ܢb�3�%;'��sWUe^W��W���h�_�"}�N)<�]D:~�d�T�P۶'"#~2o���ԝ��GE4J&�U�`��$��1�~X�3����J0��g�	���w	!���n��-�1�     